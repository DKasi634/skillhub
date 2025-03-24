interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

const NavItem = ({ icon, text, active }: NavItemProps)=> {
  return (
    <a
      href="#"
      className={`flex items-center space-x-2 relative py-2 ${
        active ? 'text-purple-500' : 'text-gray-400'
      } hover:text-purple-500 transition-colors`}
    >
      {icon}
      <span>{text}</span>
      {active && <div className="h-0.5 w-full bg-purple-500 absolute -bottom-4 left-0" />}
    </a>
  );
}

export default NavItem