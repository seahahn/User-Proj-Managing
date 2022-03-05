async function saveProject(req, rep) {
    const collection = this.mongo.db.collection("ml_proj_structure");
    console.log(req.body);
    const { user_idx, proj_idx, layout } = req.body;
    const result = await collection.insertOne({
        user_idx: user_idx,
        proj_idx: proj_idx,
        layout: layout,
    });
    return result;
}

// 프로젝트 불러오기
async function loadProject(req, rep) {
    console.log(req.params);
    const collection = this.mongo.db.collection("ml_proj_structure");
    const result = await collection.findOne({
        user_idx: req.params.user_idx,
        proj_idx: req.params.proj_idx,
    });
    if (!result) {
        throw new Error("Invalid value");
    }
    return result;
}

// 전체 프로젝트 목록 불러오기(관리자 기능 목적)
async function loadProjects(req, rep) {
    const collection = this.mongo.db.collection("ml_proj_structure");
    const result = await collection.find().toArray();
    if (result.length === 0) {
        throw new Error("No documents found");
    }
    return result;
}

async function updateProject(req, rep) {
    console.log(req.params);
    console.log(req.body.layout);
    const collection = this.mongo.db.collection("ml_proj_structure");
    const result = await collection.updateOne(
        {
            user_idx: req.params.user_idx,
            proj_idx: req.params.proj_idx,
        },
        {
            $set: {
                layout: req.body.layout,
            },
        }
    );
    return result;
}

async function deleteProject(req, rep) {
    console.log(req.params);
    const collection = this.mongo.db.collection("ml_proj_structure");
    const result = await collection.deleteOne({
        user_idx: req.params.user_idx,
        proj_idx: req.params.proj_idx,
    });
    return result;
}

async function deleteAllProjects(req, rep) {
    const collection = this.mongo.db.collection("ml_proj_structure");
    const result = await collection.deleteMany({});
    return result;
}

export { saveProject, loadProject, loadProjects, updateProject, deleteProject, deleteAllProjects };
