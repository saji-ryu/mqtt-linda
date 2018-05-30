import express from 'express';
import {onSublist} from "../server";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('watch', {
        initData:onSublist,
        onTuple: {type: 'sublist', value: 'on'},
        offTuple: {type: 'sublist', value: 'off'}
    });
});

export default router;