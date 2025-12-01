const FaceType = ({ data }) => {

    return (
        <div className={ 'measurements_used' }>
            <h4> { data?.translation } </h4>
            {
                data.traits.map((trait) => {

                    return (
                        <div>
                            <h6 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: 0 }}> { trait?.name } </h6>
                            <p>{ trait?.explanation }</p>
                            { trait?.evidence?.image_url ? <img src={ trait?.evidence?.image_url } alt={ trait?.name } style={{ maxWidth: '350px' }} /> : <></> }
                            { trait?.evidence?.measurements_used ? <pre>
                                {JSON.stringify(trait?.evidence?.measurements_used, null, 2)}
                            </pre> : <></> }
                            { trait?.evidence?.notes ? <p>Notes: { trait?.evidence?.notes }</p> : <></> }
                        </div>
                    )

                })
            }
        </div>
    )

}

export default FaceType;