import React from "react";
import { Link } from "react-router-dom";
import SVG from 'react-inlinesvg';
interface BrandProps {
    logoPath: string;
    link:string;
}

export const Brand: React.FC<BrandProps> = ({ logoPath,link }) => {
    // @ts-ignore
    return (
        <>
            {/* begin::Brand */}
            <div className={`aside-brand d-flex flex-column align-items-center flex-column-auto py-5 py-lg-12`}>
                {/* begin::Logo */}
                <Link to={link}
                      className="brand-logo ">
                    <SVG src={logoPath} className={'img-fluid hover-image'}/>
                </Link>
                {/* end::Logo */}
            </div>
            {/* end::Brand */}
        </>
    );
};
