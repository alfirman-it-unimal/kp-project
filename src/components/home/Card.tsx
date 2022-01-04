interface CardProps {
  color: string;
  title: string;
  data: {
    text: string;
    value: number;
    icon: string;
  }[];
}

export const Card = ({ color, title, data }: CardProps) => {
  const totalJiwa = data
    .map((el) => el.value)
    .reduce((prev, curr) => prev + curr);

  return (
    <div className="card-class">
      <div className="card-category-top">
        <div className={`card-category-title card-bg-${color}`}>
          <h1>{title}</h1>
        </div>
        <div className="card-category-total">
          <h5>JUMLAH TOTAL {totalJiwa} JIWA</h5>
        </div>
      </div>
      <div className="card-category-bottom">
        {data.map((el, index) => (
          <div key={index} className="card-category-info">
            <div className="card-category-icon">
              <i aria-hidden="true" className={`fas ${el.icon}`}></i>
            </div>
            <div className="card-category-text">
              <p>{el.text}</p>
              <span>{el.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
