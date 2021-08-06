const TableX = ({ head, body }) => {
  const keyList = head.map(({ key }) => key)

  return (
    <table className='tableX'>
      <thead>
        <tr>
          {head.map(({ key, value }) => (
            <th key={key}>{value}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {body.map((row, idx) => (
          <tr key={idx}>
            {keyList.map((key) => (
              <td key={key}>{row[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TableX
