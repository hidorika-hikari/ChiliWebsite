import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const DashboardBox = (props) => {

    return (
            <div className="dashboardBox" style={{
                backgroundImage:`linear-gradient(to right, ${props.color?.[0]}, ${props.color?.[1]})`
            }}>
                {
                    props.grow === true ?
                    <span className="chart"><TrendingUpIcon/></span>
                    :
                    <span className="chart"><TrendingDownIcon/></span>
                }

                <div className="d-flex w-100">
                    <div className="col1">
                        <h4 className="text-white">{props.title}</h4>
                        <span className="text-white">{props.count}</span>
                    </div>
                    
                    <div className="ms-auto">
                        <span className="icon">
                            {props.icon? props.icon : ''}
                        </span>
                    </div>
                </div>
            </div>
    )
}

export default DashboardBox;