import React, { useContext, useEffect, useState } from 'react'

class RouterContextClass {
  private routes: { [key: string]: (active: boolean) => void } = {}
  private activeRoute?: string
  registerRoute(route: string, cb: (active: boolean) => void) {
    this.routes[route] = cb
    if (this.activeRoute && this.activeRoute === route) {
      this.routes[route](true)
    }
  }
  unregisterRoute(route: string) {
    delete this.routes[route]
  }
  setRoute(route: string) {
    if (route !== this.activeRoute && this.routes[route]) {
      if (this.activeRoute && this.routes[this.activeRoute]) {
        this.routes[this.activeRoute](false)
      }
      this.activeRoute = route
      // CONTINUE: Find out why <Route>'s are being removed from the "DOM"
      if (this.routes[route]) {
        this.routes[route](true)
      }
    }
  }
  setDefaultRoute(route: string) {
    if (!this.activeRoute) {
      this.setRoute(route)
    }
  }
}

const contextState = new RouterContextClass()

export const RouterContext = React.createContext(contextState)

export interface RouterProps {
  defaultRoute: string
}

export const Router: React.FC<RouterProps> = props => {
  const ctx = useContext(RouterContext)

  useEffect(() => {
    ctx.setDefaultRoute(props.defaultRoute)
  }, [props.defaultRoute])

  return <RouterContext.Provider value={contextState}>{props.children}</RouterContext.Provider>
}

export interface RouteProps {
  component: any
  path: string
}

export const Route: React.FC<RouteProps> = ({ component, path }) => {
  const ctx = useContext(RouterContext)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const callback = active => {
      setActive(active)
    }
    ctx.registerRoute(path, callback)
    return () => {
      ctx.unregisterRoute(path)
    }
  })

  return active ? <>{component}</> : null
}
