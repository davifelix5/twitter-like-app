import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './pages/Home'
import Tweets from './pages/Tweets'

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/tweets" component={Tweets} />
                <Route component={() => <div>Page not found! :(</div>} />
            </Switch>
        </BrowserRouter>
    )
}
