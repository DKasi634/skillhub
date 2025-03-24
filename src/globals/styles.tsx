import styled, { keyframes } from "styled-components";

export const shimer = keyframes`
    from{
        background-position: -200px -100px;
    }to {
        background-position: 200px 100px;
    }
`
export const LoaderSmWrapper = styled.div`
    border: 0.3rem solid rgb(16, 16, 16);
    border-top-color: rgb(245, 122, 30);
`

export const ShimerEffect = styled.div`
    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 30%);
    background-size: 800px 100%;
    animation: ${shimer} 1.5s infinite;
`

export const HiddenScrollbarWrapper = styled.div`
    overflow-y: scroll;
    scrollbar-width: 0;
    &::-webkit-scrollbar{
        width: 0;
        scrollbar-width: 0;
    }
`