export default function ButtonLoc(props: {
  selected: boolean;
  handleClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => props.handleClick()}
      className={`px-4 py-2 max-w-64
      ${
        props.selected
          ? "bg-white border-primary-600 text-primary-700 hover:bg-primary-600 font-bold"
          : "bg-white border-gray-300 text-gray-300 hover:bg-gray-300"
      }
    border-2 w-5/6 rounded-full text-center  transition-colors hover:text-white`}
    >
      {props.children}
    </button>
  );
}
