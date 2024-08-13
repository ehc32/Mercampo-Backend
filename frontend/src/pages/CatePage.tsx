import { Link } from "react-router-dom";

const CatePage = () => {

    return (
        <div className="flex justify-center">
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-16">

                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <Link to={`/cate/Maquillaje`}>
                        <img
                            className="rounded-t-lg"
                    src="/static/logo.png"
                            alt=""
                        />
                    </Link>
                    <div className="p-5 ">
                        <Link to={`/cate/Maquillaje`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Maquillaje
                            </h5>
                        </Link>
                    </div>
                </div>

                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <Link to={`/cate/Zapatos y Sandalias`}>
                        <img
                            className="rounded-t-lg"
                    src="/static/logo.png"
                            alt=""
                        />
                    </Link>
                    <div className="p-5 ">
                        <Link to={`/cate/Zapatos y Sandalias`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Zapatos y Sandalias
                            </h5>
                        </Link>
                    </div>
                </div>

                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <Link to={`/cate/Zapatos y Sandalias`}>
                        <img
                            className="rounded-t-lg"
                    src="/static/logo.png"
                            alt=""
                        />
                    </Link>
                    <div className="p-5 ">
                        <Link to={`/cate/Zapatos y Sandalias`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Comida
                            </h5>
                        </Link>
                    </div>
                </div>

                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <Link to={`/cate/Lang`}>
                        <img
                            className="rounded-t-lg"
                    src="/static/logo.png"
                            alt=""
                        />
                    </Link>
                    <div className="p-5 ">
                        <Link to={`/cate/Ropa`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Ropa
                            </h5>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default CatePage;
