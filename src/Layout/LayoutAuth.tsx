import React from 'react';
import {Outlet} from "react-router-dom";

interface LayoutAuthProps {
	svg?: string;
	showLogo?: boolean;
	routeName?: string;
	t?: any; // Type this according to the type of 't'
	children?: React.ReactNode;
}

const LayoutAuth: React.FC<LayoutAuthProps> = ({ svg, showLogo, routeName, t, children }) => {
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		setLoading(false);
	}, []);

	const setLang = (lang: string) => {
		// Implement your setLang logic here
	};

	return (
		<>
			<div className='d-flex flex-column flex-root'>
				{/* begin::Login */}
				<div className='flex-row' style={{ flex: 1 }}>
					{/* begin::Languages */}
					<div
						className={'justify-content-center d-flex align-items-center'}
						style={{ height: '100vh' }}
					>
						{/* begin::Content body */}
						<Outlet />
						{/* end::Content body */}
					</div>
					{/* end::Content */}
				</div>
				{/* end::Login */}
			</div>
		</>
	);
};

export default LayoutAuth;
