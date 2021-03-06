import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import reqURL from '../RequestURL';
import './ReplySection.css';
// add credentials or else the session will not be saved
axios.defaults.withCredentials = true;

export default class ReplyComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReplyClicked: false,
      isRepliesHidden: true,
      replyStatement: '',
      videoUploader: '',
      replyList: [],
      replyUsername: '',
      commentIndex: null,
    };
  }

  componentDidMount() {
    const { commentIndex, commentUsername } = this.props;
    document.getElementsByClassName('reply-submit')[commentIndex].disabled = true;
    document.getElementsByClassName('reply-submit')[commentIndex].style.backgroundColor = '#AAABB8';

    if (commentUsername === '') {
      document.getElementsByClassName('reply-area')[commentIndex].disabled = true;
      document.getElementsByClassName('reply-area')[commentIndex].placeholder = 'Please login to reply to comments!';
    }

    this.setState({ commentIndex, replyUsername: commentUsername });
    // console.log(commentIndex);
    // grabs video url inside current url
    const getID = (window.location.href).split('/').pop();
    const reqVideoID = { videoID: getID };
    axios.post(`${reqURL}/getVideo`, reqVideoID)
      .then((videoData) => {
        // console.log('replies', videoData.data.comments[this.state.commentIndex].replies);
        if (videoData.data.comments[commentIndex].replies.length === 0) {
          document.getElementsByClassName('show-replies')[commentIndex].style.display = 'none';
        }
        this.setState({
          videoUploader: videoData.data.userName,
          replyList: videoData.data.comments[commentIndex].replies,
        });
        // console.log('uploader', this.state.videoUploader
      })
      .catch((err) => {
        throw err;
      });
  }

  componentDidUpdate() {
    const { replyStatement } = this.state;
    const { commentUsername, commentIndex } = this.props;
    if (commentUsername !== '' && replyStatement !== '') {
      document.getElementsByClassName('reply-submit')[commentIndex].disabled = false;
      document.getElementsByClassName('reply-submit')[commentIndex].style.backgroundColor = '#17202A';
    } else {
      document.getElementsByClassName('reply-submit')[commentIndex].disabled = true;
      document.getElementsByClassName('reply-submit')[commentIndex].style.backgroundColor = '#AAABB8';
    }
  }

  onReplyClick = () => {
    const { commentIndex } = this.props;
    // console.log('index', commentIndex);
    document.getElementsByClassName('reply-container')[commentIndex].style.display = 'block';
    document.getElementsByClassName('reply-area')[commentIndex].style.display = 'block';
    document.getElementsByClassName('show-reply-submit')[commentIndex].style.display = 'none';
    document.getElementsByClassName('show-reply-submit2')[commentIndex].style.display = 'none';
    document.getElementsByClassName('show-replies')[commentIndex].style.display = 'none';
    document.getElementsByClassName('cancel-button')[commentIndex].style.display = 'inline';
    document.getElementsByClassName('hide-replies')[commentIndex].style.display = 'none';
    document.getElementsByClassName('reply-submit')[commentIndex].style.display = 'inline';
    document.getElementsByClassName('reply-counter')[commentIndex].style.display = 'block';

    // this.setState({ isReplyClicked: true });
  }

  onReplyCancel = () => {
    const { commentIndex } = this.props;
    const { replyList } = this.state;
    if (replyList.length === 0) {
      document.getElementsByClassName('show-reply-submit')[commentIndex].style.display = 'inline';
      document.getElementsByClassName('hide-replies')[commentIndex].style.display = 'none';
      document.getElementsByClassName('show-reply-submit2')[commentIndex].style.display = 'none';
    } else  {
      document.getElementsByClassName('hide-replies')[commentIndex].style.display = 'inline';
      document.getElementsByClassName('show-reply-submit2')[commentIndex].style.display = 'inline';
      document.getElementsByClassName('reply-submit')[commentIndex].style.display = 'none';
    }
    document.getElementsByClassName('cancel-button')[commentIndex].style.display = 'none';
    document.getElementsByClassName('reply-area')[commentIndex].style.display = 'none';
    document.getElementsByClassName('reply-submit')[commentIndex].style.display = 'none';
    document.getElementsByClassName('reply-counter')[commentIndex].style.display = 'none';
  }

  onRepliesHide = () => {
    const { commentIndex } = this.props;
    document.getElementsByClassName('reply-container')[commentIndex].style.display = 'none';
    document.getElementsByClassName('reply-area')[commentIndex].style.display = 'none';
    document.getElementsByClassName('hide-replies')[commentIndex].style.display = 'none';
    document.getElementsByClassName('show-reply-submit2')[commentIndex].style.display = 'none';
    document.getElementsByClassName('show-replies')[commentIndex].style.display = 'inline';
    document.getElementsByClassName('show-reply-submit')[commentIndex].style.display = 'inline';
  }

  onRepliesShow = () => {
    const { commentIndex } = this.props;
    document.getElementsByClassName('show-replies')[commentIndex].style.display = 'none';
    document.getElementsByClassName('show-reply-submit')[commentIndex].style.display = 'none';
    document.getElementsByClassName('show-reply-submit2')[commentIndex].style.display = 'inline';
    document.getElementsByClassName('hide-replies')[commentIndex].style.display = 'inline';
    document.getElementsByClassName('reply-container')[commentIndex].style.display = 'block';
  }

  onReplySubmit = () => {
    const { commentIndex } = this.props;
    document.getElementsByClassName('cancel-button')[commentIndex].style.display = 'none';
    document.getElementsByClassName('reply-area')[commentIndex].style.display = 'none';
    document.getElementsByClassName('reply-submit')[commentIndex].style.display = 'none';
    document.getElementsByClassName('hide-replies')[commentIndex].style.display = 'inline';
    document.getElementsByClassName('show-reply-submit2')[commentIndex].style.display = 'inline';
    document.getElementsByClassName('reply-counter')[commentIndex].style.display = 'none';
    const { videoUploader, replyStatement } = this.state;
    // grabs video url inside current url
    const getID = (window.location.href).split('/').pop();
    // console.log(this.state.commentIndex);
    const replyData = {
      videoID: getID,
      videoUploader,
      replyStatement,
      commentIndex,
    };
    axios.post(`${reqURL}/addReplies`, replyData)
      .then((data) => {
        // console.log('mydata', data)
        this.setState({
          replyList: data.data,
          isReplyClicked: false,
          isRepliesHidden: false,
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  handleReplyChange = (event) => {
    this.setState({ replyStatement: event.target.value });
  }

  render() {
    const { replyList, replyStatement } = this.state;
    return (
      <div>
        <div className="first-button-set reply-buttons">
          <button type="submit" className="show-replies" onClick={this.onRepliesShow}>Show Replies </button>
          <button type="submit" className="show-reply-submit" onClick={this.onReplyClick}> Reply </button>
        </div>
        <div className="reply-container">
          {replyList.map((props) => {
            return (
              <div key={props.id} className="text-reply">
                <p> <b>{props.username[0].toUpperCase() + props.username.slice(1)}</b>:</p>
                <p> {props.comment} </p>
              </div>
            );
          })}
        </div>
        <div className="reply-buttons">
          <textarea id="reply-text" maxLength="350" className="reply-area" placeholder="Add reply here" onChange={this.handleReplyChange} />
          <p className="reply-counter">{replyStatement.length}/350 character length</p>
          <button type="submit" className="hide-replies reply-button-cancel" onClick={this.onRepliesHide}>Hide Replies</button>
          <button type="submit" className="show-reply-submit2" onClick={this.onReplyClick}> Reply </button>
        </div>
        <div className="reply-buttons">
          <button type="button" className="cancel-button reply-button-cancel" onClick={this.onReplyCancel}>Cancel</button>
          <button id="reply-submit" type="submit" className="reply-submit" onClick={this.onReplySubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

ReplyComments.defaultProps = {
  commentIndex: null,
  commentUsername: '',
};

ReplyComments.propTypes = {
  commentIndex: PropTypes.number,
  commentUsername: PropTypes.string,
};
