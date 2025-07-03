function Listy({ image, name, price, handle_delete, id }) {
  return (
    <div className="flex items-center bg-blue-50 rounded-xl shadow-md p-4">
      <img
        className="w-24 h-24 object-cover rounded-lg"
        src={image || 'https://via.placeholder.com/150'}
        alt={name}
      />

      <div className="flex flex-col flex-grow px-4">
        <h2 className="text-2xl font-semibold">{name}</h2>
      </div>
      <div className="flex flex-col">
        <span className=" text-2xl mb-4">Price: Rs {price}</span>
        <button
          onClick={() => handle_delete(id)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
        </div>
    </div>
  );  
}

export default Listy;
