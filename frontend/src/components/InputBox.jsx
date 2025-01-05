export const InputBox = ({type, placeholder, id, label, onChange}) => {
   return (
    <>
        <h2 className="font-medium sm:font-bold text-base sm:text-lg text-left mt-1 sm:mt-3">{label}</h2>
        <input type={type} onChange={onChange} required className="rounded-lg p-2 font-medium border-black border w-full h-fit " id={id} placeholder={placeholder}/>
    </>
   )
}