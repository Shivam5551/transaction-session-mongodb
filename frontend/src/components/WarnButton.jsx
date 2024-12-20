export const WarnButton = ( {label, to, refer}) => {
    return (
        <div className="font-semibold text-lg">
            {label}
            <a href={to} className="ml-2 text-blue-700 hover:underline">{refer}</a>
        </div>
    )
}