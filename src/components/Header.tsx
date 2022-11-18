interface HeaderProps {
  title: string;
}
const Header = ({ title }: HeaderProps) => {
  return (
    <header className="bg-white relative hidden md:block top-16 border-b-4  border-[#faa458]">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c6004c] to-[#8d1946]">{title}</span>
      </div>
    </header>)
};

export default Header;