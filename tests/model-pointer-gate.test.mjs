import assert from "node:assert/strict";
import test from "node:test";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, OrthographicCamera, TOUCH } from "three";
import { OrbitControls } from "three-stdlib";
import { installModelPointerGate } from "../src/app/home-hero/model-pointer-gate.js";

// Dispatch capture listeners first, as a browser does, without a WebGL context.
function surface() {
  const listeners = new Map();
  return {
    style: {}, clientWidth: 400, clientHeight: 300,
    getBoundingClientRect() { return { left: 10, top: 20, width: this.clientWidth, height: this.clientHeight }; },
    releasePointerCapture() {},
    addEventListener(type, callback, capture = false) {
      const list = listeners.get(type) ?? [];
      list.push({ callback, capture: capture === true });
      listeners.set(type, list);
    },
    removeEventListener(type, callback) { listeners.set(type, (listeners.get(type) ?? []).filter((listener) => listener.callback !== callback)); },
    emit(type, x, y) {
      const event = {
        pointerType: "touch", pointerId: 1, clientX: x, clientY: y, pageX: x, pageY: y,
        stopped: false, defaultPrevented: false,
        stopImmediatePropagation() { this.stopped = true; },
        preventDefault() { this.defaultPrevented = true; },
      };
      const ordered = [...(listeners.get(type) ?? [])].sort((a, b) => Number(b.capture) - Number(a.capture));
      for (const { callback } of ordered) { if (event.stopped) break; callback(event); }
      return event;
    },
  };
}

function setup() {
  const canvas = surface();
  canvas.ownerDocument = surface();
  const camera = new OrthographicCamera(-5, 5, 3.75, -3.75, .1, 50);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  const model = new Group();
  const mesh = new Mesh(new BoxGeometry(1.6, 1.6, 1.6), new MeshBasicMaterial());
  model.add(mesh);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.touches = { ONE: TOUCH.ROTATE, TWO: null };
  // Install after the controls to verify capture gating does not depend on order.
  const removeGate = installModelPointerGate(canvas, camera, () => model);
  const cleanup = () => { removeGate(); controls.dispose(); mesh.geometry.dispose(); mesh.material.dispose(); };
  return { canvas, camera, model, controls, removeGate, cleanup };
}

test("a white-space touch never starts orbiting or prevents native scrolling", () => {
  const { canvas, camera, controls, cleanup } = setup();
  let starts = 0;
  controls.addEventListener("start", () => starts++);
  const before = camera.position.clone();
  const contact = canvas.emit("pointerdown", 30, 40);
  canvas.ownerDocument.emit("pointermove", 210, 170);
  assert.equal(starts, 0);
  assert.equal(camera.position.distanceTo(before), 0);
  assert.equal(contact.stopped, true);
  assert.equal(contact.defaultPrevented, false);
  cleanup();
});

test("a model touch rotates and can continue into white space until cancelled", () => {
  const { canvas, camera, controls, cleanup } = setup();
  let starts = 0;
  controls.addEventListener("start", () => starts++);
  const before = camera.position.clone();
  const contact = canvas.emit("pointerdown", 210, 170);
  canvas.ownerDocument.emit("pointermove", 350, 170);
  assert.equal(contact.stopped, false);
  assert.equal(starts, 1);
  assert.ok(camera.position.distanceTo(before) > .1);
  canvas.emit("pointercancel", 350, 170);
  const cancelled = camera.position.clone();
  canvas.ownerDocument.emit("pointermove", 390, 170);
  assert.equal(camera.position.distanceTo(cancelled), 0);
  cleanup();
});

test("hit testing follows responsive canvas bounds and the current camera", () => {
  const { canvas, camera, cleanup } = setup();
  canvas.clientWidth = 200;
  canvas.clientHeight = 150;
  camera.position.set(10, 0, 0);
  camera.lookAt(0, 0, 0);
  assert.equal(canvas.emit("pointerdown", 110, 95).stopped, false);
  canvas.emit("pointercancel", 110, 95);
  assert.equal(canvas.emit("pointerdown", 20, 25).stopped, true);
  cleanup();
});

test("hidden model surfaces are not touch targets and removing the gate cleans up", () => {
  const { canvas, model, removeGate, cleanup } = setup();
  model.visible = false;
  assert.equal(canvas.emit("pointerdown", 210, 170).stopped, true);
  removeGate();
  assert.equal(canvas.emit("pointerdown", 210, 170).stopped, false);
  canvas.emit("pointercancel", 210, 170);
  cleanup();
});
