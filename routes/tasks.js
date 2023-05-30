const mongoose = require('mongoose')
const router = require('express').Router();
const passport = require('passport');
const Task = require('../model/task');

router.post('/add', passport.authenticate('jwt', {session: false}), (req,res,next) => {
    let object = {
        user: req.user._id,
        todo: req.body.todo
    } 
    if(req.body.deadline) {
        object = {
            user: req.user._id,
            todo: req.body.todo,
            deadline: req.body.deadline
        }
    }
    const newTask = new Task(object);

    newTask.save()
    .then((task) => {
        res.status(200).json({
            success: true,
            msg: "task has been added to the TaskList"
        })
    })
    .catch(err => {
        console.log("There is an error: ",err);
        next(err);
    });
})

router.put('/update/:id', passport.authenticate('jwt', {session: false}), async (req,res,next) => {
    const taskID = req.params.id;
    let task = await Task.findByIdAndUpdate(taskID, {
        user: req.user._id,
        todo: req.body.todo,
        deadline: req.body.deadline
    })
    task = await task.save()
    if(!task) {
        return res.status(500).json({success: false, msg: "task not found"});
    } else {
        return res.status(200).json({
            success: true,
            msg: "task is updated successfully",
            updatedTask: task
        })
    }
})

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), async (req,res,next) => {
    const taskID = req.params.id;
    // console.log(taskID);
    let task = await Task.findByIdAndRemove(taskID);
    // console.log(task)
    if(!task) {
        return res.status(500).json({
            success: false,
            msg: "Task not found"
        })
    } else {
        return res.status(200).json({
            success: true,
            msg: "Task deleted successfully",
            deletedTask: task
        })
    }
})

router.get('/', passport.authenticate('jwt', {session: false}), async (req,res,next) => {
    const maxPageSize = 10;

    let limit = req.query.limit
    let offset = req.query.offset

    if(!limit) {
        if(req.query.pagesize && req.query.pagesize < maxPageSize) {
            limit = req.query.pagesize
        }  else {
            limit  = maxPageSize
        }
    }

    if(!offset) {
        if(req.query.page) {
            offset = req.query.page * limit 
        }  else {
            offset  = 0;
        }
    }


    const tasks = await Task.find({}).limit(limit).skip(offset);
    
    return res.status(200).json({
        success: true,
        data: tasks
    })
})

module.exports = router;