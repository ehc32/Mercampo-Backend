import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import './ST.css'
const ST_Icon = () => {
    return (
        <div className="h-full min-w-52 m-2 flex row  whitespace-nowrap" style={{ pointerEvents: 'none' }}>
            <img
                className="h-10 w-auto lg:block mx-1 relative top-1"
                src="/public/lo.ico"
                alt="Logo"
            />
            <HorizontalRuleIcon className='rotaricon' />
            <p className="hover-class fs-16px font-bold text-white">
                Servicios <br />
                Tecnológicos
            </p>
        </div>
    )
}
export default ST_Icon;