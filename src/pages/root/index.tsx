import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { Router } from '../router';
import Layout from '../../Layout/layout';
import LayoutAuth from '../../Layout/LayoutAuth';
import ErrorPage from '../error'
import Dashboard from "@/pages/dashboard";
import LayoutEmpty from "@/Layout/LayoutEmpty";
export default function route() {

    return <>
        <Switch>
            <Router
                path={'/dashboard'}

                component={Dashboard}
                layout={LayoutAuth}
            />
            <Router
                path='/404'
                exact

                component={ ErrorPage}
                layout={LayoutEmpty}
            />
            <Redirect to='/404' />
        </Switch>

    </>
}
