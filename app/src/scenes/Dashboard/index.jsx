import React from 'react';
import { debounce as _debounce } from 'lodash';
import _ from 'lodash';
import axios from 'axios';
import './styles.scss';


function Dashboard() {


    const [searchText, setSearchText] = React.useState('');
    const [filterText, setFilterText] = React.useState('');
    const [listOfTweets, setListOfTweets] = React.useState(null);
    const [hashtagList, setHashtagList] = React.useState([]);
    const [lastId, setLastId] = React.useState(null);


    /* Pull tweets by search term or filter */
    /* Re-call API when search or filter text changes */
    React.useEffect(() => {
        axios.get('/api/search', {
            params: {
                q: filterText || searchText,
                result_type: 'popular',
                count: 5,
            },
        })
            .then(({ data }) => {
                const { statuses } = data;
                const newList = [];
                setListOfTweets(statuses);

                statuses.forEach((status) => {
                    const { entities } = status;
                    const { hashtags } = entities;

                    if (hashtags.length > 0) {
                        hashtags.forEach((tag) => {
                            const { text } = tag;
                            if (!newList.includes(text)) {
                                newList.push(text);
                            }
                        });
                    }

                    setLastId(status.id);
                });
                setHashtagList(newList);
            }).catch(err => alert(err.message))
    }, [searchText, filterText]);


    /* On new keypress in search input, set search text */
    // eslint-disable-next-line
    const debounceSearch = React.useCallback(_debounce((newVal) => {
        setSearchText(newVal);
    }, 500), []);


    /*  Load more button loads the next 5 tweets using max_id */
    function loadMore(e) {
        e.stopPropagation();

        axios.get('/api/load-more', {
            params: {
                q: filterText || searchText,
                result_type: 'popular',
                count: 5,
                max_id: lastId,
            },
        })
            .then(({ data }) => {
                const { statuses } = data;
                const newList = hashtagList;
                const newTweetObj = listOfTweets;

                statuses.forEach((status) => {
                    const { entities } = status;
                    const { hashtags } = entities;

                    newTweetObj.push(status);

                    if (hashtags.length > 0) {
                        hashtags.forEach((tag) => {
                            const { text } = tag;
                            if (!newList.includes(text)) {
                                newList.push(text);
                            }
                        });
                    }

                    setLastId(status.id);
                });
                setListOfTweets(newTweetObj);
                setHashtagList(newList);
            }).catch(err => alert(err.message));
    }


    return (
        <React.Fragment>
            <div className="container">
                <div className="mainContent">
                    <h3>Tweet Feed</h3>
                    <span className="search">
                        <input
                            className="searchInput"
                            defaultValue={searchText}
                            onChange={(e) => debounceSearch(e.target.value)}
                            placeholder="Search by keyword"
                            type="search"
                        />
                    </span>
                    {searchText
                        ? (
                            <React.Fragment>
                                <div className="filterHashtagsMobile">
                                    <h4>Filter by hashtag</h4>
                                    <div
                                        onChange={(e) => {
                                            if (e.target.checked) setFilterText(e.target.value);
                                            else setFilterText('');
                                        }}
                                    >
                                        {hashtagList.map((hashtag) => {
                                            return (
                                                <label>
                                                    <input
                                                        className="hashtag"
                                                        type="checkbox"
                                                        name="hashtagsMobile"
                                                        id="hashtagsMobile"
                                                        value={hashtag}
                                                        checked={filterText === hashtag}
                                                    />
                                                    #{hashtag}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="feedContent">
                                    {listOfTweets && listOfTweets.map((tweet) => {
                                        const {text, user, entities} = tweet;
                                        const {hashtags} = entities;
                                        const splitIndex = text.indexOf('http');
                                        let url = '';
                                        let decodedContent = _.unescape(text);

                                        if (splitIndex > 0) {
                                            const content = text.substring(0, splitIndex);
                                            url = text.substring(splitIndex);
                                            decodedContent = _.unescape(content);
                                        }

                                        return (
                                            <div className="tweetBox">
                                                <img
                                                    alt="User"
                                                    className="profilePicture"
                                                    src={user.profile_image_url}
                                                />
                                                <div className="tweetContent">
                                                    <h4>@{user.screen_name}</h4>
                                                    <p>
                                                        {decodedContent}
                                                        {url && <a className="tweetLink" href={url}>{url}</a>}
                                                    </p>
                                                    {hashtags && Object.keys(hashtags).map((key, index) => {
                                                        const hashtag = hashtags[key];
                                                        return (
                                                            <div
                                                                key={index}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setFilterText(e.target.value);
                                                                    }
                                                                    else setFilterText('');
                                                                }}
                                                            >
                                                                <label>
                                                                    <input
                                                                        className="hashtag"
                                                                        type="checkbox"
                                                                        name="postHashtags"
                                                                        id="postHashtags"
                                                                        value={hashtag.text}
                                                                        checked={filterText === hashtag.text}
                                                                    />
                                                                    #{hashtag.text}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {lastId && listOfTweets.length > 4 &&
                                        <button className="loadMore" onClick={(e) => loadMore(e)}>Load more</button>
                                    }
                                </div>
                            </React.Fragment>
                        ) : (
                            <div className="noResults">Please type a search term to continue</div>
                        )
                    }
                </div>
                {searchText &&
                    <div className="filterHashtags">
                        <h4>Filter by hashtag</h4>
                        <div
                            onChange={(e) => {
                                if (e.target.checked) setFilterText(e.target.value);
                                else setFilterText('');
                            }}
                        >
                            {hashtagList.map((hashtag) => {
                                return (
                                    <label>
                                        <input
                                            className="hashtag"
                                            type="checkbox"
                                            name="hashtags"
                                            id="hashtags"
                                            value={hashtag}
                                            checked={filterText === hashtag}
                                        />
                                        #{hashtag}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                }
            </div>
        </React.Fragment>
    );
}

export default Dashboard;
