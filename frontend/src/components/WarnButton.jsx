export const WarnButton = ( {label, to, refer}) => {
    return (
        <div className="font-medium sm:font-semibold text-xs sm:text-lg">
            {label}
            <a href={to} className="ml-1 sm:ml-2 text-blue-700 hover:underline">{refer}</a>
        </div>
    )
}