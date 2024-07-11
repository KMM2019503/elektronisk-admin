interface Props {
  title: string;
  desc: string;
}

const Heading = ({ ...props }: Props) => {
  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl font-bold">{props.title}</h1>
      <p>{props.desc} </p>
    </div>
  );
};

export default Heading;
