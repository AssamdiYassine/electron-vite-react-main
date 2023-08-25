/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import {Brand} from "@/components/brand/Brand";
import SVG from 'react-inlinesvg';
import Logout from '../assets/logout.svg'
import Logo from '../assets/Logo.svg'
import profile from '../assets/profile.svg'
import Dolar from '../assets/dollar.svg'

interface MyNavLinkProps {
    link: string;
    svg: any;
    txt: string;
}

interface AsideProps {

}

export const Aside: React.FC<AsideProps> = () => {
    let width = window.innerWidth;

    return (
        <>
            {/* begin::Aside */}
            <div   id={'leftCol'} className="   d-flex   my-4 col   " style={{marginRight:20,marginLeft:20 }}>
                {/* begin::Primary */}
                <div className="bg-dark  d-flex flex-column align-items-center flex-row-auto px-4 justify-content-between "
                     style={{borderRadius:15 }}
                >
                    <div>

                    <div className={"pt-5"}>
                   <Brand logoPath={Logo} link={'/dashboard'}/>
                    </div>

                    {/* begin::Nav Wrapper */}
                    {/* Remove " flex-column-fluid "::To solve aside footer bottom padding */}
                    <div className="  d-flex flex-column align-items-center py-5 px-4 scrollA scrollA-pull">
                        <div className={`scrollA scrollA-pull overflow-auto `}>
                            {/* begin::Nav */}
                            <ul className="list-unstyled flex-column" role="tablist">
                                {/* begin::Item */}
                                <MyNavLink
                                    svg={profile}
                                    txt={'Members'}
                                    link="/members"
                                />
                                <div className="aside-separator" />
                                <div className={'pt-5'}>

                                    <MyNavLink
                                        svg={Dolar}
                                        txt={'Paiment'}
                                        link="/paiment"
                                    />
                                </div>

                            </ul>
                        </div>
                        {/* end::Nav */}

                    </div>

                    </div>
                    <div className="  d-flex flex-column align-items-center flex-column-auto pt-4 py-lg-10  mb-5">
                        <ul className="list-unstyled">

                            <MyNavLink
                                svg={Logout}
                                txt={"Logout"}
                                link="/"
                            />
                        </ul>
                    </div>

                    {/* ... Other content ... */}
                    {/* end::Nav Wrapper */}
                </div>
                {/* end::Primary */}
            </div>
            {/* end::Aside */}
        </>
    );
};

const MyNavLink: React.FC<MyNavLinkProps> = ({ link, svg , txt }) => {
    return (
        <li
            className="nav-item mb-3 img-fluid hover-image"
            data-toggle="tooltip"
            data-placement="right"
            data-container="body"
            data-boundary="window"
            title="Latest Project"
        >
            <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="latest-project">{txt}</Tooltip>}
            >
                <NavLink
                    to={`${link}`}

                    className="nav-link btn btn-icon btn-clean btn-lg"
                >
          <span className="svg-icon svg-icon-lg">
            <SVG src={svg} />
          </span>
                </NavLink>
            </OverlayTrigger>
        </li>
    );
};
