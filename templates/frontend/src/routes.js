import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './pages/Home'
import Tweets from './pages/Tweets'
import Profile from './pages/Profile'

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/feed" component={Tweets} />
                <Route path="/profile" component={Profile} />
                <Route component={() => <div>Page not found! :(</div>} />
            </Switch>
        </BrowserRouter>
    )
}
