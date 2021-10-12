import React from 'react';
import { debounce as _debounce } from 'lodash';
import _ from 'lodash';
import axios from 'axios';
import './styles.scss';


function Dashboard() {


    const [searchText, setSearchText] = React.useState('');
    const [filterArray, setFilterArray] = React.useState([]);
    const [listOfTweets, setListOfTweets] = React.useState(null);
    const [hashtagList, setHashtagList] = React.useState([]);
    const [lastId, setLastId] = React.useState(null);
    // console.log('filterValue', filterValue);


    /* Pull tweets by search term or filter */
    function filterFeed() {
        axios.get('/api/search', {
            params: {
                q: searchText,
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
    }

    React.useEffect(() => {
        filterFeed();
    }, [searchText]);

    //
    // React.useEffect(() => {
    //     filterFeed();
    // }, []);


    /* On new keypress in search input, set search text */
    // eslint-disable-next-line
    const debounceSearch = React.useCallback(_debounce((newVal) => {
        setSearchText(newVal);
    }, 500), []);


    function loadMore(e) {
        e.stopPropagation();

        axios.get('/api/load-more', {
            params: {
                q: searchText,
                result_type: 'popular',
                count: 5,
                max_id: lastId,
            },
        })
            .then(({ data }) => {
                const { statuses } = data;
                const newList = hashtagList;

                statuses.forEach((status) => {
                    const { entities } = status;
                    const { hashtags } = entities;

                    setListOfTweets((tweets) => {
                        tweets.push(status);
                        return tweets;
                    });

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
            }).catch(err => alert(err.message));
    }


    return (
        <div className="container">
            <div className="mainContent">
                <h3 className="headerText">Tweet Feed</h3>
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
                                <div>
                                    {hashtagList.map((hashtag) => {
                                        const isChecked = filterArray[hashtag];
                                        return (
                                            <div>
                                                <label className={isChecked ? "checkedlabel" : "label"}>
                                                    #{hashtag}
                                                </label>
                                                <input
                                                    className="hashtag"
                                                    id="test"
                                                    onChange={(e) => {
                                                        setFilterArray((array) => {
                                                            array[hashtag] = e.target.checked;
                                                            return array;
                                                        });
                                                    }}
                                                    type="checkbox"
                                                    value={hashtag}
                                                />
                                            </div>
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
                                            <img alt="User" className="profilePicture" src={user.profile_image_url}/>
                                            <div className="tweetContent">
                                                <h4>@{user.screen_name}</h4>
                                                <p>
                                                    {decodedContent}
                                                    {url && <a className="tweetLink" href={url}>{url}</a>}
                                                </p>
                                                {hashtags && Object.keys(hashtags).map((key, index) => {
                                                    const hashtag = hashtags[key];
                                                    return (
                                                        <span className="usedTags" key={index}>
                                                            #{hashtag.text}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                                {lastId &&
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
                    {hashtagList.map((hashtag) => {
                        const isChecked = filterArray[hashtag];
                        return (
                            <div className="test">
                                <label>#{hashtag}</label>
                                <input
                                    className="hashtag"
                                    checked={isChecked}
                                    id="test"
                                    onChange={(e) => {
                                        console.log('e', e.target.checked);
                                        setFilterArray((array) => {
                                            array[hashtag] = e.target.checked;
                                            console.log('array', array);
                                            return array;
                                        });
                                    }}
                                    type="checkbox"
                                    value={hashtag}
                                />
                            </div>
                        );
                    })}
                </div>
            }
        </div>
    );
}

export default Dashboard;
