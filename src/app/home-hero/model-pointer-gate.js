import { Raycaster, Vector2 } from "three";

// OrbitControls listens to the canvas, so only admit gestures on visible meshes.
// Check the first contact once; an admitted drag can continue beyond the model.
export function installModelPointerGate(element, camera, getModel) {
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const meshes = [];
  const intersections = [];

  const onPointerDown = (event) => {
    const model = getModel();
    const rect = element.getBoundingClientRect();
    meshes.length = 0;
    intersections.length = 0;
    if (model && rect.width > 0 && rect.height > 0) {
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      camera.updateWorldMatrix(true, false);
      model.updateWorldMatrix(true, true);
      model.traverseVisible((object) => { if (object.isMesh) meshes.push(object); });
      raycaster.setFromCamera(pointer, camera);
      raycaster.intersectObjects(meshes, false, intersections);
    }
    // Leave browser scrolling alone; only stop controls receiving this contact.
    if (!intersections.length) event.stopImmediatePropagation();
  };

  element.addEventListener("pointerdown", onPointerDown, true);
  return () => element.removeEventListener("pointerdown", onPointerDown, true);
}
