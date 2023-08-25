import React from "react";
import { Route, RouteProps } from "react-router-dom";

interface RouterProps extends RouteProps {
    component: React.ComponentType<any>;
    layout: React.ComponentType<any>;
}

export function Router({
                           component: Component,
                           layout: Layout,
                           ...props
                       }: RouterProps) {
    return (
        <Route {...props}>
            {(routeState) => (
                <Layout {...routeState}>
                    <Component {...routeState} />
                </Layout>
            )}
        </Route>
    );
}
