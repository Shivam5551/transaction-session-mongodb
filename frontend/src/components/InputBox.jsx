export const InputBox = ({type, placeholder, id, label, onChange}) => {
   return (
    <>
        <h2 className="font-bold text-lg  text-left mt-3">{label}</h2>
        <input type={type} onChange={onChange} required className="rounded-lg p-2 font-medium border-black border w-full h-fit " id={id} placeholder={placeholder}/>
    </>
   )
}