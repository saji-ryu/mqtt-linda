import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send({
        topicStructure: ["type", "name", "where","who"],
        port:1883
    });
});

export default router;