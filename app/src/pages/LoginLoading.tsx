import Navbar from '../components/Navbar'
import { ring2 } from 'ldrs';

export default function LoginLoading() {

    ring2.register()

    return (
        <>
            <Navbar />
            <div className="loading">
                <l-ring-2
                    size="40"
                    stroke="5"
                    stroke-length="0.25"
                    bg-opacity="0.1"
                    speed="0.8"
                    color="black"
                />
                <p>Loading...</p>
            </div>
        </>
    );
}
