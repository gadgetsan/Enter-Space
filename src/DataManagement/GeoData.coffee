#ChunkSize: la taille (en qt de block) des chunks que l'on va gerer
#ChunksQt: la quantity de chunks que l'on va avoir (^3)

class GeoData
    constructor: (@Name, @ChunkSize, @ChunkLength) ->
        @ChunksQt = Math.ceil((@ChunkLength) / @ChunkSize)

    Upload: (@DataObj) ->
        #à partir de ce moment, om va gèrér ce qui est loader, ce qui est sauvegardé emptyVector

        #ON commence par génerer nos chunks

        @ChunksQt = Math.ceil((@ChunkLength) / @ChunkSize)
        @Chunks = []
        @ChunkState = []
        for i in [0 .. @ChunksQt-1]
            @Chunks.push([])
            @ChunkState.push([])
            for j in [0 .. @ChunksQt-1]
                @Chunks[i].push([])
                @ChunkState[i].push([])
                for k in [0 .. @ChunksQt-1]
                    start = [i*@ChunkSize, j*@ChunkSize, k*@ChunkSize]
                    slice = Geo.Slice(@DataObj.Data, start, [@ChunkSize, @ChunkSize,@ChunkSize])
                    @Chunks[i][j].push(null)
                    @ChunkState[i][j].push("db")
                    @SaveChunk([i,j,k], Geo.CompressData(slice))



    SaveChunk: (location, data) ->
        #console.log("Saving Chunk "+ location)
        openRequest = indexedDB.open("EnterSpace_v1",1);
        openRequest.onupgradeneeded = (e) ->
            db = e.target.result;
            console.log("upgradeneeded");
            if !db.objectStoreNames.contains("Chunks")
                objectStore = db.createObjectStore("Chunks", { keyPath: "Index" })
                objectStore.createIndex("Index","Index", {unique:true})

        openRequest.onsuccess = (e) =>
            db = e.target.result

            newTransaction = db.transaction(["Chunks"],"readwrite");
            newStore = newTransaction.objectStore("Chunks");
            chunks = {
                Index: @Name + ": " + location[0] + "-" + location[1] + "-" + location[2],
                data: data,
            }
            request = newStore.put(chunks);
            request.onerror = (e) ->
                console.dir(e.target.error);


        openRequest.onerror = (e) ->
            console.log("Error");
            console.dir(e);

    LoadChunk: (index, cb) =>

        if !(!@ChunkState || !@ChunkState[index[0]]  || !@ChunkState[index[0]][index[1]] || !@ChunkState[index[0]][index[1]][index[2]] == "db")
            return

        openRequest = indexedDB.open("EnterSpace_v1",1)
        openRequest.onupgradeneeded = (e)->
            db = e.target.result
            console.log("upgradeneeded")
            if !db.objectStoreNames.contains("Chunks")
                objectStore = db.createObjectStore("Chunks", { keyPath: "Index" })
                objectStore.createIndex("Index","Index", {unique:true})



        openRequest.onsuccess = (e) =>
            db = e.target.result

            transaction = db.transaction(["Chunks"],"readonly")
            store = transaction.objectStore("Chunks")
            ob = store.get(@Name + ": " + index[0] + "-" + index[1] + "-" + index[2])

            ob.onsuccess = (e)=>
                result = e.target.result;

                if result
                    if !@Chunks
                        @Chunks = []

                    if !@Chunks[index[0]]
                        @Chunks[index[0]] = []

                    if !@Chunks[index[0]][index[1]]
                        @Chunks[index[0]][index[1]] = []

                    @Chunks[index[0]][index[1]][index[2]] = Geo.UncompressData(result.data, @ChunkSize)
                    #console.log("loaded Chunk " + index)
                    if !@ChunkState
                        @ChunkState = []

                    if !@ChunkState[index[0]]
                        @ChunkState[index[0]] = []

                    if !@ChunkState[index[0]][index[1]]
                        @ChunkState[index[0]][index[1]] = []

                    @ChunkState[index[0]][index[1]][index[2]]  = "cache"
                    cb(null)
                else
                    cb("No Result")


            ob.onerror = (e)=>
                cb(e)


        openRequest.onerror = (e) ->
            console.log("Error")
            console.dir(e)
            cb(e)

    GetSlice: (start, length, granularity,cb)=>
        #On veut une slice, on va commencer par savoir quel chunk on dois aller chercher
        startingChunk = [Math.floor(start[0]/@ChunkSize), Math.floor(start[1]/@ChunkSize), Math.floor(start[2]/@ChunkSize)]
        endingChunk = [Math.ceil((start[0]+length[0])/@ChunkSize), Math.ceil((start[1]+length[1])/@ChunkSize), Math.ceil((start[2]+length[2])/@ChunkSize)]

        #Ensuite, on va chercher les chunk (à moins qu'elles soit deja en memoire)
        chunksToLoad = []
        for i in [startingChunk[0] .. endingChunk[0]]
            for j in [startingChunk[1] .. endingChunk[1]]
                for k in [startingChunk[2] .. endingChunk[2]]
                    chunksToLoad.push([i, j, k])


        async.each(chunksToLoad, @LoadChunk, (err)=>
            #Les Chunks ont terminé de loader, on reconstruit la slice que l'on veut
                sliced = []
                for i in [start[0] .. start[0]+length[0]*granularity] by granularity
                    iChunk = Math.floor(i/@ChunkSize)
                    iInChunk = i-(iChunk*@ChunkSize)
                    slicedI = (i-start[0])/granularity
                    sliced.push([])
                    for j in [start[1] .. start[1]+length[1]*granularity] by granularity
                        jChunk = Math.floor(j/@ChunkSize)
                        jInChunk = j-(jChunk*@ChunkSize)
                        slicedJ = (j-start[1])/granularity
                        sliced[slicedI].push([])
                        for k in [start[2] .. start[2]+length[2]*granularity] by granularity
                            kChunk = Math.floor(k/@ChunkSize)
                            kInChunk = k-(kChunk*@ChunkSize)
                            if iChunk < @ChunksQt && jChunk < @ChunksQt && kChunk < @ChunksQt && @Chunks[iChunk] && @Chunks[iChunk][jChunk] && @Chunks[iChunk][jChunk][kChunk] && @Chunks[iChunk][jChunk][kChunk][iInChunk] && @Chunks[iChunk][jChunk][kChunk][iInChunk][jInChunk]
                                sliced[slicedI][slicedJ].push(@Chunks[iChunk][jChunk][kChunk][iInChunk][jInChunk][kInChunk])
                            else
                                sliced[slicedI][slicedJ].push(0)

                cb(null, sliced)
        )
