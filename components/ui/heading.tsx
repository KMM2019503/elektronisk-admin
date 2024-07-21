interface Props {
  title: string;
  desc?: string;
}

const Heading = ({ ...props }: Props) => {
  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl font-bold font-mono">{props.title}</h1>
      <p className="text-gray-500 text-sm font-mono">{props.desc} </p>
    </div>
  );
};

export default Heading;
