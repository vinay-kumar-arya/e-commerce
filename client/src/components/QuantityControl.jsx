const QuantityControl = ({ productQuantity = 0, setProductQuantity }) => {
  const increase = () => {
    const newQty = productQuantity + 1;
    setProductQuantity(newQty);
  };

  const decrease = () => {
    if (productQuantity > 1) {
      const newQty = productQuantity - 1;
      setProductQuantity(newQty);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <button className="btn btn-outline-primary" onClick={decrease}>
        -
      </button>
      <span className="fw-bold">{productQuantity}</span>
      <button className="btn btn-outline-primary" onClick={increase}>
        +
      </button>
    </div>
  );
};

export default QuantityControl;
