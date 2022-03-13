
import './App.css';
import React from 'react';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            todolist:[],
            active:{
                id:null,
                task:'',
                completed:false
            },
            editing:false
            
        };
        this.fetchtasks=this.fetchtasks.bind(this)
        this.handlechange=this.handlechange.bind(this)
        this.handlesubmit=this.handlesubmit.bind(this)
        this.getCookie=this.getCookie.bind(this)
        this.deletetask=this.deletetask.bind(this)
        this.startedit=this.startedit.bind(this)
    };
    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    componentDidMount(){
        this.fetchtasks()

    }
    fetchtasks(){
     fetch('http://127.0.0.1:8000/task-list/')
        .then(response=> response.json())
        .then(data=>this.setState({
            todolist:data
        }))
    }
    handlechange(e){
        var task_title=e.target.name
        var value=e.target.value
        console.log('title',task_title)
        console.log('value',value)

        this.setState({
            active:{
                ...this.state.active,
                task:value
            }
        })
    }
    handlesubmit(e){
        e.preventDefault()
        console.log('item',this.state.active)
        var csrftoken = this.getCookie('csrftoken')
        var url="http://127.0.0.1:8000/task-create/"

        if(this.state.editing===true){
            url=`http://127.0.0.1:8000/task-update/${this.state.active.id}/`
            this.setState({
                editing:false
            })
        }
        fetch(url,
            {method:'POST',
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken
            },
            body:JSON.stringify(this.state.active)
            }).then((response)=>{
                this.fetchtasks()
                this.setState({
                    active:{
                    id:null,
                    task:'',
                    completed:false
                },

                })
            }).catch(function(error){
                console.log(error)
            })
    }
    startedit(task){
        this.setState({
            active:task,
            editing:true
        })

    }
    deletetask(task){
        var csrftoken = this.getCookie('csrftoken')
        fetch(`http://127.0.0.1:8000/task-delete/${task.id}/`,{
            'method':'DELETE',
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken
            }
        }
        ).then((response)=>{
            this.fetchtasks()
        })
    }
    render(){
        var tasks=this.state.todolist
        var self=this
        return(
            
            <div className='container' style={{marginTop:'80px',paddingTop:'40px'}}>
                <div className='header-bar'>Tasks List</div>
                <div id='task-container'>
                    
                    <form onSubmit={this.handlesubmit}>
                        <div>
                            <div style={{flex:6,paddingBottom:'5px'}}>
                                <input onChange={this.handlechange} className='form-control' name='task_title' value={this.state.active.task} placeholder='Enter Task'></input>
                            </div>
                    
                            <div style={{flex:2}}>
                                <input id='submit' className='btn btn-primary' type='submit' name='Add'></input>
                            </div>
                        </div>
                    </form>

                    
                    <div id='list'>
                        {tasks.map(function(eachtask,index){
                            return(
                                <div key={index} className='flex-wrapper'>
                                    <span>
                                    <div style={{display:'inline-block',margin:'20px'}}>
                                        {eachtask.completed===false ?(
                                                 <span>{eachtask.task}</span>
                                        ):(
                                            <strike>{eachtask.task}</strike>
                                        )}
                                   
                                    </div>
                                    <div style={{float:'right'}}>
                                    <button type="button" onClick={()=>self.deletetask(eachtask)} className="btn btn-outline-danger">Danger</button>
                                    </div>
                                    <div style={{float:'right',marginRight:'5px'}}>
                                    <button type="button" onClick={()=>self.startedit(eachtask)} className="btn btn-outline-info">Edit</button>
                                    </div>
                                    
                                    </span>
                                </div>
                            )
                        })}

                    </div>

                </div>
            </div>
        )
    }
}

export default App;
