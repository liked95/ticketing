import Link from 'next/link';

export default ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign up', href: '/auth/signup' },
        !currentUser && { label: 'Sign in', href: '/auth/signin' },
        currentUser && {label: 'Sell Tickets', href: '/tickets/new'},
        currentUser && {label: 'My tickets', href: '/tickets/admin'},
        currentUser && {label: 'My Orders', href: '/orders'},
        currentUser && { label: 'Sign out', href: '/auth/signout' }
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href }) => {
            return <li className="nav-item" key={href}>
                <Link href={href} className="nav-link">
                    {label}
                </Link>
            </li>
        })


    return (
        <nav className="navbar navbar-light bg-light p-3">
            <div className="d-flex align-items-center">
                <Link href="/" className="navbar-brand">
                    SonnyVegas
                </Link>
                {currentUser && (
                    <span className="navbar-text ms-3">
                        Hello, {currentUser.email}
                    </span>
                )}
            </div>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </nav>
    );
};

