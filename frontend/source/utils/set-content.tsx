import Loading from '../components/loading.js';
import ErrorMessage from '../components/error.js';
import Skeleton from '../components/skeleton.js';

const setContent = (status: string, Component: React.ComponentType<{ data: any }>, data: any, errorMessage: string = '') => {
    switch (status) {
        case 'waiting':
            return <Skeleton/>;
        case 'loading':
            return <Loading/>;
        case 'confirmed':
            return <Component data={data}/>;
        case 'error':
            return <ErrorMessage errorMessage={errorMessage} />;
        default:
            throw new Error('Unexpected status state');
    }
}

export default setContent;