function CarInfo(props) {
  return (
    <section style={{ border: '1px solid gray', padding: '10px', margin: '10px' }}>
      <h2>{props.title}</h2>
      <p>Μάρκα: {props.brand}</p>
      <p>Μοντέλο: {props.model}</p>
      <p>Έτος: {props.year}</p>
    </section>
  )
}

export default CarInfo;