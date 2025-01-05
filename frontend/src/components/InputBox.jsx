export const InputBox = ({type, placeholder, id, label, onChange}) => {
   return (
    <>
        <h2 className="font-medium sm:font-bold text-xs sm:text-lg text-left mt-1 sm:mt-3">{label}</h2>
        <input type={type} onChange={onChange} required className="text-sm sm:text-base rounded-md sm:rounded-lg p-1 sm:p-2 font-medium border-black border w-full h-fit " id={id} placeholder={placeholder}/>
    </>
   )
}