"use client";

const footerLinks = {
  Product: ["Ivy Core", "Ivy Drive", "Ivy Agents", "Ivy Flow", "Pricing"],
  Company: ["About", "Blog", "Careers", "Press", "Contact"],
  Developers: ["Documentation", "API Reference", "SDK", "Status", "Changelog"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

export default function Footer() {
  return (
    <footer className="border-t border-ivy-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <IvyLogo />
              <span className="text-ivy-text font-semibold text-[15px]">Ivy</span>
            </div>
            <p className="text-xs text-ivy-text-muted leading-relaxed max-w-[180px]">
              The AI-native workspace. Built for the next generation of computing.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div className="text-xs font-semibold text-ivy-text uppercase tracking-wider mb-4">
                {category}
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-ivy-text-muted hover:text-ivy-text transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-ivy-border gap-4">
          <p className="text-xs text-ivy-text-muted">
            © {new Date().getFullYear()} Ivy Technologies, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-ivy-green" />
            <span className="text-xs text-ivy-text-muted">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function IvyLogo() {
  return (
    <div className="relative w-7 h-7 rounded-lg bg-ivy-green/10 flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
          stroke="#4afa98"
          strokeWidth="1.2"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z"
          fill="#4afa98"
          fillOpacity="0.3"
        />
      </svg>
    </div>
  );
}
