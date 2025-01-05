export const Button = ({label, isSubmitting, onClick}) => {
    return (
        <button 
            onClick={onClick}
            type="submit" 
            disabled={isSubmitting} 
            className = {` ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} 
                            p-1 sm:p-3 text-lg my-1 sm:my-3 font-medium sm:font-semibold rounded-sm sm:rounded-xl w-full 
                                text-center items-center bg-black text-white 
                                hover:text-black border-2  hover:bg-gray-400`
                        }>
        {label}
        </button>                
    )
}