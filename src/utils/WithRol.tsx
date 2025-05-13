import React from 'react';
import { Rol } from '../types/Usuario';


interface WithRoleProps {
  user: { rol: Rol };
}

const withRole = <P extends object>(Component: React.ComponentType<P>, allowedRoles: Rol[]) => {
  return class WithRole extends React.Component<P & WithRoleProps> {
    render() {
      const { user, ...props } = this.props as WithRoleProps;
      if (allowedRoles.includes(user.rol)) {
        return <Component {...props as P} />;
      } else {
        return null;
      }
    }
  };
};

export default withRole;