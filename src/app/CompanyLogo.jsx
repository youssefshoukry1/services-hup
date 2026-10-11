import Image from "next/image";
import ServiceIcon from "./ServiceIcon";
import { companyAsset } from "../lib/company-assets";
import styles from "./company-logo.module.css";

export default function CompanyLogo({ company, sizes, className, alt = "" }) {
  if (!company.logo) return <ServiceIcon type={company.categoryId} className={styles.fallback} />;
  return <Image src={companyAsset(company.logo, company.categoryId)} alt={alt} fill sizes={sizes} className={className} />;
}
