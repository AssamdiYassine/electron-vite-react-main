

import React, { Component, ReactNode } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import $ from 'jquery';
import { Aside } from '../components/Aside';
import  Logo from '../assets/BlackLogo.svg'


interface RootState {
	userreducer: {
		user: User | null;
		token: string | null;
	};

}

interface User {
	// Define your user properties here
}

interface LayoutProps extends RouteComponentProps {
	children: ReactNode;

}

interface LayoutState {
	loading: boolean;
}

class Layout extends Component<LayoutProps, LayoutState> {
	constructor(props: LayoutProps) {
		super(props);
		this.state = {
			loading: true,
		};
	}

	componentDidMount() {
		this.setState({ loading: false });

		$(document).on('click', 'div.offcanvas-mobile-overlay', () => {
			console.log('in');
			$('#kt_profile_aside').removeClass('offcanvas-mobile-on');
			$('div.offcanvas-mobile-overlay').remove();
		});
	}

	componentDidUpdate(prevProps: LayoutProps) {
		if (this.props.location !== prevProps.location) {
			$('#kt_profile_aside').removeClass('offcanvas-mobile-on');
			$('div.offcanvas-mobile-overlay').remove();
		}
	}

	render() {
		const { loading } = this.state;

		if (loading) {
			return (
				<div id='splash-screen' className='kt-splash-screen'>
					<img src={Logo} alt='Chronos' />
					<svg className='splash-spinner' viewBox='0 0 50 50'>
						<circle className='path' cx='25' cy='25' r='20' fill='none' strokeWidth='5'></circle>
					</svg>
				</div>
			);
		}

		const { children   } = this.props;

		return (
			<>
				{/*begin::Main*/}

				<div className='d-flex flex-column flex-root'>
					{/*begin::Page*/}
					<div className='d-flex flex-row flex-column-fluid page'>
						<div className={'col-2'}>
						<Aside  />
						</div>
						{/*begin::Wrapper*/}
						<div className='d-flex flex-column flex-row-fluid wrapper col w-100 px-5 py-2' id='kt_wrapper'>
							{/*begin::Content*/}
							<div id='kt_content' className={`content d-flex flex-column flex-column-fluid`}   style={{ flex: 1 }}>
								{/* <AnimateLoading /> */}
								{/* {headerTitle && <SubHeader headerTitle={headerTitle} />} */}

								<div className={''}>
								{children}
								</div>
								{/*end::Entry*/}
							</div>
							{/*end::Content*/}
							{/*<Footer t={t} />*/}
						</div>
						{/*end::Wrapper*/}
					</div>
					{/*end::Page*/}
				</div>
			</>
		);
	}
}


export default withRouter(Layout);
