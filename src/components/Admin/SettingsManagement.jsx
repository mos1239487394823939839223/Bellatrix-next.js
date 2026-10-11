import React, { useState } from "react";
import {
  Cog6ToothIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import FooterSettings from "../../page-components/FooterSettings";
import QuickLinksSettings from "../../page-components/QuickLinksSettings";
import { PageHeader, Tabs } from "./ui";

const TABS = [
  {
    id: "footer",
    name: "Footer",
    icon: Cog6ToothIcon,
  },
  {
    id: "quick-links",
    name: "Quick links",
    icon: LinkIcon,
  },
];

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState("footer");

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Site-wide content that appears on every page." />

      <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} />

      <div key={activeTab}>
        {activeTab === "footer" && <FooterSettings />}
        {activeTab === "quick-links" && <QuickLinksSettings />}
      </div>
    </div>
  );
};

export default SettingsManagement;
