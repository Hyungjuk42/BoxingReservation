export default function DeleteButtonSm(props: {
  handleClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => props.handleClick()}
      className={`px-2 py-2 bg-red-400 hover:bg-red-500 text-white border-red rounded-md text-center transition-colors border border-solid`}
    >
      {props.children}
    </button>
  );
}
