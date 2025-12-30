export const checkOwnership = (Model) => async (req, res, next) => {
    try {
        const { id } = req.params;

        const userId = req.auth?.userId;
        const modelName = Model.modelName;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: No user identifier found in token" });
        }

        const resource = await Model.findById(id);

        if (!resource) {
            return res.status(404).json({ error: `${modelName} not found` });
        }

        if (resource.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: `Access denied, You don't own this ${modelName}` });
        }

        req.resource = resource;
        next();
    } catch (err) {
        console.error("Ownership Middleware Error:", err);
        res.status(500).json({ error: "Internal server error during authorization" });
    }
};