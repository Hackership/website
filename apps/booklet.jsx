
var SheetNames = {
    '2014.06 "Berlin"' : "1mIGsrYx9dWTrxQWWYSkniGis--kX7sH8IwmRTEwwma8",
    '2015.01 "Gran Canaria"' : "1IJz8jEZ8OD8NE2isne-IF9eYSvOGFqHYvD6C8IXcMoQ"
}

var ExampleData = {
    "Name": "Benjamin Kampmann",
    "Image": "http://discourse.opentechschool.org/user_avatar/discourse.opentechschool.org/ben/240/427.png",
    "Keywords": "Web, Reactjs, Python, Full-Stack",
    "Contacts": "\n - <ben@hackership.org>\n - [@techCreationist](http://www.twitter.com/techCreationist)\n - [www.create-build-execute.com](http://www.create-build-execute.com/)",
    "Background": "I’m a prize winning graphic designer and typographer with over 8 years experience designing and implementing advertising campaigns. This includes making interactive ads and online magazines using a combination of **HTML5, CSS, PHP and Actionscript**.\n\nMy client list includes Sony, Adidas, Jägermeister, Virgin Mobile, Mazda and many others in the fashion and music business. I’m unique as I’m part tech, but my illustration work is printed alongside Fafi, my typography is exhibited in the United States, and I’ve been asked to design special edition Adidas jackets. That’s an unusual mix.",
    "At Hackership": "I focused on **Python and machine learning** and spent time learning **pandas and scikit- learn**, and applying them to Kaggle problems. This culminated in me leading a tutorial at the PyCon UK 2014 conference. During the Hackership, I also founded the Kaggle Berlin Meetup group, and co-organized the inaugural PyData Berlin 2014 conference. I also took the opportunity to review the mechanics of the **Bitcoin protocol** in greater depth, a long- held interest that previously remained non-technical.",
    "What's Next?": "I would like to find a **junior back-end or Mid-level front-end position** at an interesting company, ideally with some sort of focus on encryption and/or internet privacy."
}

var Sheets = {};

var _callbacks = [];

$.each(SheetNames, function(name, val){
  Tabletop.init({
        key: val,
        callback: function(data){
            Sheets[name] = data;
            $.each(_callbacks, function(idx, x){
                x(name);
            });
        },
        simpleSheet: true,
        debug: true
        });
});

function saveMarkdown(content){
    if (!content) return
    return marked(content);
}
var Loading = React.createClass({
    render: function(){
        return (<div className="progress">
      <div className="indeterminate"></div>
  </div>)
    }
});

var FrontPage = React.createClass({
    render: function(){
        return (<div id="frontPage">
                    <img src="./cert-bg.png" />
                    <h1>Hackership Learners</h1>
                    <h2>{this.props.batch}</h2>
                </div>)
    }
})

var Card = React.createClass({
    render: function() {
        var data = this.props.data,
            image = (<img style={{width: "100%"}} src={data.Image} />),
            keywords = data.Keywords ? (<div className="keywords">
                            {data.Keywords}
                        </div>) : null,
            contacts = data.Contacts ? (<div className="contacts"
                    dangerouslySetInnerHTML={{__html: saveMarkdown(data.Contacts)}} />) : null;

        return (<div className="row">
                    <div className="col s4 m4 l4">
                        {image}
                    </div>
                    <div className="col s8 m8 l8">
                        <h1>{data.Name}</h1>
                        {keywords}
                        {contacts}
                    </div>
                </div>);
    }
});


var Item = React.createClass({
    render: function(){
        var data = this.props.item;
        return (<section>
                    <Card data={data} />

                    <h2>Prior Experience</h2>
                    <div dangerouslySetInnerHTML={{__html: saveMarkdown(data["Background"])}} />
                    <h2>At Hackership</h2>
                    <div dangerouslySetInnerHTML={{__html: saveMarkdown(data["At Hackership"])}} />
                    <h2>Looking forward</h2>
                    <div dangerouslySetInnerHTML={{__html: saveMarkdown(data["What's Next?"])}} />
                    <hr className="noprint"/>
                </section>);
    }

});

var Header = React.createClass({
                    // <a target="_blank" href="https://docs.google.com/forms/d/1npxwefBCRa7gvyEr7PX11Uq9OclLxEEOmk8QC9O_44k/viewform" className="btn waves-effect waves-light" >Add
                    //     <i className="mdi-content-add"></i>
                    // </a>
    componentWillMount: function(){
        _callbacks.push(this.forceUpdate.bind(this));
    },
    render: function(){
        var header = this,
            items = $.map(Sheets, function(x, val){
            var active = header.props.active == val ? "active" : null,
                selector = function(){
                    header.props.selectBatch(val);
                };
            return (<li onClick={selector} className="tab">
                        <a className={active}>{val}</a>
                    </li>)

        });
        return (<div className="row noprint" style={{"text-align": "center"}}>
                    <h1>Hackership Learners</h1>
                    <p>Select your release</p>
                 <nav>
                    <ul className="tabs">
                        {items}
                    </ul>
                 </nav>
                </div>);
    }
})


var Booklet = React.createClass({
    getInitialState: function(){
        return {selectedBatch: null, loading: true};
    },
    componentWillMount: function(){
        _callbacks.push(this.batchFound.bind(this));
    },
    batchFound: function(batch){
        if (!this.state.selectedBatch){
            this.setState({selectedBatch: batch, loading: false});
        }
    },
    selectBatch: function(s){
        this.setState({selectedBatch: s});
    },
    render: function(){
        var items;
        if (this.state.loading){

            items = (<Loading />)

        } else {
            var data = Sheets[this.state.selectedBatch];
            if (!data){
                items = (<Item item={ExampleData} />);
            } else {
                items = $.map(data, function(i){
                    return (<Item item={i} />)
                });
            }
        }

        return (<div>
                    <Header active={this.state.selectedBatch} selectBatch={this.selectBatch} />
                    <FrontPage batch={this.state.selectedBatch} />
                    {items}
                </div>);
    }
});

// var AddForm = React.createClass({
//     componentWillMount: function(){

//     },
//     getInitialState: function(){
//         return {data: ""};
//     },
//     render: function(){
//         return (<div dangerouslySetInnerHTML={this.data}>)
//     }
// });


React.render(<Booklet />, document.getElementById("booklet"));
