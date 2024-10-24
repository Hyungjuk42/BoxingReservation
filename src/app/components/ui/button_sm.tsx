export default function ButtonSm(props: {
  clicked: boolean;
  handleClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => props.handleClick()}
      className={`px-2 py-2
      ${
        props.clicked
          ? "bg-white text-black border-gray-200"
          : "bg-black text-white border-black"
      }
      rounded-sm text-center transition-colors border border-solid`}
    >
      {props.children}
    </button>
  );
}
