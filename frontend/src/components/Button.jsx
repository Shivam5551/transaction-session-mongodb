export const Button = ({label, isSubmitting, onClick}) => {
    return (
        <button 
            onClick={onClick}
            type="submit" 
            disabled={isSubmitting} 
            className = {` ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} 
                            p-3 text-lg my-3 font-semibold rounded-xl w-full 
                                text-center items-center bg-black text-white 
                                hover:text-black border-2  hover:bg-gray-400`
                        }>
        {label}
        </button>                
    )
}