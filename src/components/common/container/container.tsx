import "./container.css";

interface Props {
  children: React.ReactNode;
}

function Container({ children }: Props) {
  return <div className="container">{children}</div>;
}

export default Container;
