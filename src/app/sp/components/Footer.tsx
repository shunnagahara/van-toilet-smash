"use client";

import React from "react";

interface FooterSection {
  title: string;
  icon: string;
}

interface FooterProps {
  sections?: FooterSection[];
}

const Footer: React.FC<FooterProps> = ({ sections = [] }) => {
  // デフォルトのセクション（増やすことも可能）
  const defaultSections: FooterSection[] = [
    { title: "ホーム", icon: "home" },
    { title: "検索", icon: "search" },
    { title: "設定", icon: "settings" },
  ];

  const allSections = [...defaultSections, ...sections];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-100 py-4 px-8 border-t border-gray-200">
      <div className="flex justify-around">
        {allSections.map((section, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <span className="material-icons text-gray-500">{section.icon}</span>
              <span className="text-sm font-medium mt-1">{section.title}</span>
            </div>
            {/* セクション間に縦線を表示（最後の要素には表示しない） */}
            {index < allSections.length - 1 && (
              <div className="border-l border-gray-300 h-6 mx-4"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
